import type { FC } from 'react';

import './gifLoading.css';

const GifLoading: FC = () => {
    return (<div className='gif-loading-wrapper'>
        <img className='gif-loading' src='/loading.gif' alt='加载中...' />
    </div>);
}

export default GifLoading;
