import React, { FC } from 'react';
import styles from './Title.module.scss';

type TitleProps = {
  title: string;
};

export const Title: FC<TitleProps> = ({ title }) => <h2 className={styles.title}>{title}</h2>;
