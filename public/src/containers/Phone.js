import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Phone from '../components/Phone';
import * as Actions from '../actions';

// Redux maps
function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            ...Actions
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Phone);
