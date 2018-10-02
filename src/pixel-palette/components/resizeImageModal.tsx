import React, { ChangeEvent } from 'react';
import Modal from 'react-modal';
import { store } from '../store/pixelStore';
import { ResizeImage } from '../store/resizeImage';

interface Props
{
    open: boolean;
    width: number;
    height: number;
    onClose: Function;
}

export default class ResizeImageModal extends React.PureComponent<Props>
{
    componentDidUpdate()
    {
        this.setState({width: this.props.width, height: this.props.height});
    }

    doResize()
    {
        const width = parseFloat((this.refs.width as HTMLInputElement).value);
        const height = parseFloat((this.refs.height as HTMLInputElement).value);
        if (isNaN(width) || isNaN(height))
        {
            alert('Sad numbers');
            return;
        }

        store.dispatch(ResizeImage.action(width, height));
        this.props.onClose();
    }

    render()
    {
        if (!this.props.open)
        {
            return null;
        }

        return (
            <Modal ariaHideApp={false} isOpen={true} onRequestClose={() => this.props.onClose()}>
                <label>
                    Width: 
                    <input ref="width" defaultValue={this.props.width.toString()}/>
                </label>

                <label>
                    Height: 
                    <input ref="height" defaultValue={this.props.height.toString()}/>
                </label>

                <button onClick={() => this.doResize()}>Resize</button>
                <button onClick={() => this.props.onClose()}>Close</button>
            </Modal>
        )
    }
}