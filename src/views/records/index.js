import React from 'react';
import { Link } from 'react-router-dom';
import { selectRecord } from '../../modules/exhibitShow';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const Records = props => (
  <div>
    <Link to={`${props.exhibitShowURL}/edit/new`}>New Record</Link>
    <ul>
      {props.records.map(record => (
        <li key={'record-' + record['o:id']} style={{ fontWeight: record === props.selectedRecord ? 'bold' : 'normal' }}><Link to={`${props.exhibitShowURL}/edit/${record['o:id']}`}>{record['o:title']}</Link></li>
      ))}
    </ul>
  </div>
)

const mapStateToProps = state => ({
  records: state.exhibitShow.records,
  selectedRecord: state.exhibitShow.selectedRecord
});

const mapDispatchToProps = dispatch => bindActionCreators({
  selectRecord
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Records);
