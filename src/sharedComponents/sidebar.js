import React from 'react'
import ReactDOM from 'react-dom'
import classes from './sidebar.module.scss'
import classnames from 'classnames';

export default function Sidebar({ open, children, onClose }) {
  const sideBarClassName = classnames({
    [classes['side-bar']]: true,
    [classes['open']]: open,
    [classes['close']]: !open
  });

  const containerClassName = classnames({
    [classes['container']]: true,
    [classes['open']]: open,
    [classes['close']]: !open
  });

  return <>
    {ReactDOM.createPortal(
      <div
        className={sideBarClassName}
        onClick={() => onClose()}
      />,
      document.body
    )}
    {ReactDOM.createPortal(
      <div
        className={containerClassName}
      >
        {children}
      </div>,
      document.body
    )}
  </>
}
