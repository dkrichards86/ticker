import React from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import WrapperContainer from '../containers/WrapperContainer';
import Account from '../components/Account';

import { 
    fetchLogout, patchAccount
} from '../store/actions';

const AccountContainer = (props) => {
    const account = !isEmpty(props.user) && <Account {...props} />;

    return (
        <WrapperContainer
            title="Account Settings"
            back='/'
            showDrawer={false}
            main={account} />
    );
}

const mapStateToProps = (state) => {
    const user = get(state, "user", null);

    return {
        user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(fetchLogout()),
        editAccount: (cat, success) => dispatch(patchAccount(cat, success)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);