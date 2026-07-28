"use client";
import { authClient } from "@/lib/auth";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  GalleryVerticalEnd,
  LoaderCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@repo/shared-components/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
} from "@repo/shared-components/components/ui/field";
import Link from "next/link";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return setStatus("error");
      try {
        const { error } = await authClient.verifyEmail({ query: { token } });
        setStatus(error ? "error" : "success");
      } catch {
        setStatus("error");
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <FieldGroup className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">Acme Inc.</span>
          </Link>

          {status === "loading" && (
            <>
              <LoaderCircle className="size-10 animate-spin text-muted-foreground" />
              <h1 className="text-xl font-bold">Verifying your email</h1>
              <FieldDescription>
                Please wait while we verify your email address...
              </FieldDescription>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="size-10 text-emerald-500" />
              <h1 className="text-xl font-bold">Email verified</h1>
              <FieldDescription>
                Your email has been successfully verified. You can now sign in
                to your account.
              </FieldDescription>
              <Button render={<Link href="/" />} className="mt-2 w-full">
                Sign in
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="size-10 text-destructive" />
              <h1 className="text-xl font-bold">Verification failed</h1>
              <FieldDescription>
                This verification link is invalid or has expired. Please request
                a new one.
              </FieldDescription>
              <Button
                render={<Link href="/" />}
                variant="outline"
                className="mt-2 w-full"
              >
                Back to sign in
              </Button>
            </>
          )}
        </div>
      </FieldGroup>
    </div>
  );
}
