import React, { Suspense } from 'react';
import LoginPage from './LoginPage';

const Login = () => {
    return (
        <Suspense>
            <LoginPage></LoginPage>
        </Suspense>
    );
};

export default Login;