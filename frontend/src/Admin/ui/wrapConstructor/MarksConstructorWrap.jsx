import React from 'react'

import s from './Styles.module.css';

export default function UiConstructorWrap({ children }) {
  return <section className={s.wrap}>{children}</section>;
}
