import { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <GoogleOAuthProvider clientId="147350394688-9n2a47jbigec3rq5td0a465l8deuijp6.apps.googleusercontent.com">
            <Component {...pageProps} />
        </GoogleOAuthProvider>
    );
}