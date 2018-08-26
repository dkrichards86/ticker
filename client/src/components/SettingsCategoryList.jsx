import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import update from 'immutability-helper'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SettingsCategoryListItem from './SettingsCategoryListItem';
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import SettingsCategoryForm from "./SettingsCategoryForm";

const styles = theme => ({
    content: {
        maxWidth: 800,
        margin: '0 auto'
    },
    modal: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
});

class SettingsCategoryList extends Component {
    constructor(props) {
        super(props)
        this.moveCategory = this.moveCategory.bind(this);

        this.state = { 
            categories: props.categories,
            modal: false
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({ categories: newProps.categories });
    }

    moveCategory(dragIndex, hoverIndex) {
        const { categories } = this.state;
        const draggedCategory = categories[dragIndex];

        this.setState(
            update(this.state, {
                categories: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, draggedCategory]],
                },
            })
        );
    }

    render() {
        const { classes, addCategory, editCategory, deleteCategory } = this.props;
        const { categories } = this.state;

        return (
            <div className={classes.content}>
                <Paper>
                    <DragDropContextProvider backend={HTML5Backend}>
                        <List>
                            {categories.map((cat, i) => (
                                <SettingsCategoryListItem
                                    key={cat.id}
                                    index={i}
                                    id={cat.id}
                                    category={cat}
                                    deleteCategory={deleteCategory}
                                    editCategory={editCategory}
                                    moveCategory={this.moveCategory} />
                            ))}
                        </List>
                    </DragDropContextProvider>
                    <Button
                        onClick={() => this.setState({modal: true})}
                        color="primary"
                        to="/feeds/add">
                        <AddIcon />
                        Add a Category
                    </Button>
                    <Modal
                        open={this.state.modal}
                        onClose={() => this.setState({modal: false})}>
                        <div className={classes.modal}>
                            <Typography variant="title" id="modal-title">
                                Add a Category
                            </Typography>
                            <SettingsCategoryForm
                                onSubmit={addCategory}
                                onClose={() => this.setState({modal: false})} />
                        </div>
                    </Modal>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(SettingsCategoryList);
