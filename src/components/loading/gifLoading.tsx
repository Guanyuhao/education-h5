import type { FC } from 'react';
import SciFiBackground from '../SciFiBackground';

import './gifLoading.css';

const GifLoading: FC = () => {
    return (
    <SciFiBackground>
        <div className='gif-loading-wrapper'>
            <img className='gif-loading' src='/loading.gif' alt='加载中...' />
        </div>
    </SciFiBackground>    
);
}

export default GifLoading;
