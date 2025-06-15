"use client";

import styles from "./page.module.css";
import { useState, useRef, ChangeEvent } from "react";
import WalletConnectButton from "@/components/WalletConnectButton/WalletConnectButton";
import { useAccount } from "wagmi";
import { createUser } from "../services/verdicto.api.service";
import { useSearchParams } from "next/navigation";

interface RegisterPageProps {
  initialRole: "conflict" | "mediator";
}

export default function RegisterPage({ initialRole }: RegisterPageProps) {
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get("role");
  const [role] = useState<"conflict" | "mediator">("mediator");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = useAccount();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    experience: "",
    portfolio: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadAvatarToImgBB = async (
    base64Image: string
  ): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; // замени на свой
    const formData = new FormData();
    formData.append("image", base64Image.split(",")[1]);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        return data.data.url;
      } else {
        console.error("Upload failed:", data);
        return null;
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      return null;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      alert("Please connect your wallet.");
      return;
    }

    const { name, email, experience, portfolio } = formState;

    if (role === "conflict") {
      if (!name) {
        alert("Please enter your name.");
        return;
      }

      const data = {
        role: "conflict",
        name,
        wallet: address,
      };

      console.log("Submitting conflict registration:", data);
      // TODO: отправь это в Supabase / API
    }

    if (role === "mediator") {
      if (!name || !email || !experience) {
        alert("Please fill in all required fields.");
        return;
      }

      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadAvatarToImgBB(avatar);
        if (!avatarUrl) {
          alert("Failed to upload avatar. Please try again.");
          return;
        }
      }

      const data = {
        role: "mediator",
        name,
        email,
        experience,
        portfolio,
        wallet: address,
        avatar: avatarUrl,
      };

      console.log("Submitting mediator registration:", data);
      await createUser({
        address: address,
        photoUri: avatarUrl ?? "",
        bio: experience,
        portfolioUri: portfolio ?? "",
        isMediator: true,
        name,
        email,
      });
    }
  };

  const renderAvatarUpload = () => (
    <div className={styles.avatarContainer} onClick={triggerFileInput}>
      {avatar ? (
        <img src={avatar} alt="Avatar preview" className={styles.avatarImage} />
      ) : (
        <div className={styles.avatarPlaceholder}>Click to upload avatar</div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleAvatarChange}
        className={styles.fileInput}
      />
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        {roleFromQuery === "conflict" && (
          <form className={styles.form} onSubmit={handleRegister}>
            <h2 className={styles.title}>Conflict Registration</h2>

            <div className={styles.formGroup}>
              <input
                id="name"
                className={styles.input}
                type="text"
                placeholder="Your Name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="name" className={styles.label}>
                Your Name
              </label>
            </div>

            <div className={styles.buttonWrapper}>
              <WalletConnectButton />
              <button type="submit" className={styles.registerButton}>
                Register
              </button>
            </div>
          </form>
        )}

        {roleFromQuery === "mediator" && (
          <form className={styles.form} onSubmit={handleRegister}>
            <h2 className={styles.title}>Mediator Application</h2>

            {renderAvatarUpload()}

            <div className={styles.formGroup}>
              <input
                id="name"
                className={styles.input}
                type="text"
                placeholder="Full Name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
            </div>

            <div className={styles.formGroup}>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
            </div>

            <div className={styles.formGroup}>
              <textarea
                id="experience"
                className={styles.textarea}
                placeholder="Tell us about your background..."
                rows={4}
                value={formState.experience}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="experience" className={styles.label}>
                Experience Summary
              </label>
            </div>

            <div className={styles.formGroup}>
              <input
                id="portfolio"
                className={styles.input}
                type="url"
                placeholder="https://linkedin.com/in/you"
                value={formState.portfolio}
                onChange={handleInputChange}
              />
              <label htmlFor="portfolio" className={styles.label}>
                Portfolio / LinkedIn
              </label>
            </div>

            <div className={styles.buttonWrapper}>
              <WalletConnectButton />
              <button type="submit" className={styles.registerButton}>
                Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
