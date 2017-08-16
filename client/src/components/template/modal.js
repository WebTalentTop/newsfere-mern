import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';

const propTypes = {
  handleClose: PropTypes.func,
  heading: PropTypes.string,
  isOpen: PropTypes.bool,
  children: PropTypes.node,
};

export default class Modal extends Component  {
  closeModal = () => {
     this.props.closeModal();
  }
  render() {
    const { handleClose, heading, children, isOpen } = this.props;
    return (
      <div className={`modal ${isOpen ? 'is-open' : ''}`}>
        <div className="modal-container">
          <div className="modal-content">
            <div className="heading">
              <h3>{heading}</h3>
              <div className="close" onClick={() => this.closeModal()}>
                <FontAwesome
                  className='super-crazy-colors'
                  name='remove'
                  size='1x'
                  style={{
                    textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
                    fontSize: '18px',
                  }}
                />
              </div>
            </div>
            <div>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

