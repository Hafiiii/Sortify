import VerificationSkeleton from './VerificationSkeleton';

// ----------------------------------------------------------------------

export default function EmailVerification() {
    return (
        <VerificationSkeleton
            content="We've sent a link to verify your email address before able to login. Tap the link to verify your email."
            screen="Register"
        />
    );
}