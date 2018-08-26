import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Shimmer from './Shimmer';

const PostListLoadingItem = () => {
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary>
                    <div style={{flexBasis: '100%'}}>
                        <Shimmer size="large" />
                        <Shimmer size="small" />
                    </div>
            </ExpansionPanelSummary>
        </ExpansionPanel>
    );
}

export default PostListLoadingItem;