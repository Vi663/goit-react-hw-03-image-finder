import React from 'react';
import s from './Button.module.css'

export const Button = ({onhandleSubmit}) => {
    return (
      <button onSubmit={() => onhandleSubmit()} type="submit" className={s.button}>
        Load more images
      </button>
    )
}