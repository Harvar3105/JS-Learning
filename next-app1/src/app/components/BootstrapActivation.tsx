"use client"

import { useEffect } from 'react';

function BootstrapActivation() {
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return null;
}

export default BootstrapActivation;