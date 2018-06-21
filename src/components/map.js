import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {change} from 'redux-form';

// Makes availabe to mapStateToProps
import {selectRecord, deselectRecord, previewRecord, unpreviewRecord} from '../reducers/not_refactored/exhibitShow';
import {addLayer, resetLayers} from '../reducers/not_refactored/recordMapLayers';

import {
	Map,
	LayersControl,
	TileLayer,
	WMSTileLayer,
	GeoJSON,
	FeatureGroup
} from 'react-leaflet';
import L from 'leaflet';
import {EditControl} from "react-leaflet-draw"
import {circleMarker} from 'leaflet';

// FIXME: work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png'});

class ExhibitPublicMap extends Component {

	//////////////////////////////////////////////////
	// Event handlers for map editing
	//////////////////////////////////////////////////

	_onEdited = (e) => {
		this._onChange();
	}

	_onCreated = (e) => {
		console.log(e.layer);
		const {editorRecord} = this.props;
		const recordId = editorRecord
			? editorRecord['o:id']
			: null;
		if (recordId)
			this.props.addLayer(recordId, e.layer);
		this._onChange();
	}


	_onMounted = (drawControl) => {
		this._onChange();
	}

	_onChange = () => {
		const {editorRecord, recordLayers} = this.props;
		const recordId = editorRecord
			? editorRecord['o:id']
			: null;
		const layersForRecord = recordLayers[recordId];
		if (layersForRecord && layersForRecord.length > 0) {
			const featureGroup = L.featureGroup(layersForRecord)
			const geojsonData = featureGroup.toGeoJSON();
			this.props.change('record', 'o:coverage', geojsonData);
			this.props.change('record', 'o:is_coverage', true);
		}
	}

	//////////////////////////////////////////////////
	// Render Method
	//////////////////////////////////////////////////
	render() {

		// The primary layer
		let baseLayers = [];
		baseLayers.push(<LayersControl.BaseLayer key={this.props.mapState.current.tileLayer.slug} name={this.props.mapState.current.tileLayer.displayName} checked={true}>
			<TileLayer attribution={this.props.mapState.current.tileLayer.attribution} url={this.props.mapState.current.tileLayer.url}/>
		</LayersControl.BaseLayer>);

		// Other options
		for (let x = 0; x < this.props.mapState.current.basemapOptions.length; x++) {
			let thisTileLayer = this.props.mapState.current.basemapOptions[x];
			// Don't allow duplicate
			if (thisTileLayer.slug !== this.props.mapState.current.tileLayer.slug) {
				baseLayers.push(<LayersControl.BaseLayer key={thisTileLayer.slug} name={thisTileLayer.displayName} checked={false}>
					<TileLayer attribution={thisTileLayer.attribution} url={thisTileLayer.url}/>
				</LayersControl.BaseLayer>);
			}
		}

		const {
			records,
			recordClick,
			mapClick,
			recordMouseEnter,
			recordMouseLeave,
			selectedRecord,
			previewedRecord
		} = this.props;
		const position = [51.505, -0.09];

		return (<Map center={position} zoom={13} style={{
				height: '100%'
			}} onClick={(event) => {
				if (event.originalEvent.target === event.target.getContainer())
					mapClick();
				}}>
			<LayersControl position='topright'>

				{baseLayers}

				{/* Conditional, featuregroup appears if this.props is true */}
				{
					(this.props.editorRecord || this.props.editorNewRecord) && <FeatureGroup>
							<EditControl position='topleft' onEdited={this._onEdited} onCreated={this._onCreated} onDeleted={this._onDeleted} onMounted={this._onMounted} onEditStart={this._onEditStart} onEditStop={this._onEditStop} onDeleteStart={this._onDeleteStart} onDeleteStop={this._onDeleteStop} draw={{
									rectangle: false,
									marker: false
								}}/>
						</FeatureGroup>
				}

				{
					records.map(record => {
						const isSelected = record === selectedRecord,
							isPreviewed = record === previewedRecord;
						// this.props.resetLayers(record['o:id']);
						if (record['o:is_wms']) {
							return (<LayersControl.Overlay name={record['o:title']} checked={true} key={record['o:id'] + '_wms'}>
								<WMSTileLayer url={record['o:wms_address']} layers={record['o:wms_layers']} transparent={true} format='image/png' opacity={0.8}/>
							</LayersControl.Overlay>)
						} else if (record['o:is_coverage']) {
							return (<GeoJSON style={function(feature) {
									return {
										stroke: true,
										color: '#000000',
										weight: 2,
										opacity: isSelected
											? 1.0
											: 0.6,
										fill: feature.geometry.type !== 'LineString',
										fillColor: '#00aeff',
										fillOpacity: isPreviewed
											? 0.9
											: isSelected
												? 0.6
												: 0.3
									};
								}} onClick={() => recordClick(record)} onMouseover={() => recordMouseEnter(record)} onMouseout={recordMouseLeave} data={record['o:coverage']} pointToLayer={function(point, latlng) {
									return circleMarker(latlng);
								}} onEachFeature={function(feature, layer) {
									this.props.addLayer(record['o:id'], layer);
								}.bind(this)} key={record['o:id'] + '_coverage'}/>);
						}

						return null;
					})
				}
			</LayersControl>
		</Map>)
	}
}

// maps this.props.*
const mapStateToProps = state => ({
	mapState: state.map,
	exhibit: state.exhibitShow.exhibit,
	records: state.exhibitShow.records,
	selectedRecord: state.exhibitShow.selectedRecord,
	previewedRecord: state.exhibitShow.previewedRecord,
	editorRecord: state.exhibitShow.editorRecord,
	editorNewRecord: state.exhibitShow.editorNewRecord,
	recordLayers: state.recordMapLayers.recordLayers
});

const mapDispatchToProps = dispatch => bindActionCreators({
	recordClick: record => selectRecord(record),
	mapClick: deselectRecord,
	recordMouseEnter: record => previewRecord(record),
	recordMouseLeave: unpreviewRecord,
	change,
	addLayer,
	resetLayers
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExhibitPublicMap);
