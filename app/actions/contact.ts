"use server";

import { submitContactMessage } from "@/lib/strapi/queries";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone" | "message", string>>;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) {
    return { status: "success", message: "Thank you. We will be in touch shortly." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const fieldErrors: ContactState["fieldErrors"] = {};

  if (name.length < 2) {
    fieldErrors.name = "Please enter your name.";
  }
  if (!emailPattern.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (phone && phone.replace(/\D/g, "").length < 7) {
    fieldErrors.phone = "Enter a valid phone number, or leave this blank.";
  }
  if (message.length < 20) {
    fieldErrors.message = "Please share a little more detail (at least 20 characters).";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const result = await submitContactMessage({ name, email, phone, message });

  if (result.ok) {
    return {
      status: "success",
      message: "Thank you. A member of the studio will reply shortly.",
    };
  }

  if (result.reason === "unconfigured") {
    return {
      status: "error",
      message:
        "The form is working, but Strapi is not connected yet, so this message was not stored. Please email us directly.",
    };
  }

  return {
    status: "error",
    message:
      "We could not store this message right now. Please email us directly and we will follow up.",
  };
}
