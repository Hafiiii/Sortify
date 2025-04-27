import VerificationSkeleton from './VerificationSkeleton';

// ----------------------------------------------------------------------

export default function PasswordReset() {
  return (
    <VerificationSkeleton
      content="We've sent a password reset link to your email address. Tap the link to set a new password."
      screen="Login"
    />
  );
}