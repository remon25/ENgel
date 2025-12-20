"use client";
import { useEffect, useState, useRef } from "react";
import UserForm from "@/app/_components/layout/UserForm";
import { useProfile } from "@/app/_components/useProfile";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "@/app/_components/layout/Spinner";

function EditUserPage() {
  const { loading: profileLoading, status } = useProfile(); 
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); 
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { id } = useParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchUserAndAdmin = async () => {
      try {
        if (id && !hasFetched.current) {
          console.log("Fetching user with id:", id);
          const userResponse = await fetch(`/api/profile?_id=${id}`);
          if (!userResponse.ok) {
            throw new Error("Failed to fetch user");
          }
          const userData = await userResponse.json();
          console.log("User fetched:", userData);
          setUser(userData);
          hasFetched.current = true;
        }

        const adminResponse = await fetch("/api/check-admin");
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          setIsAdmin(adminData.isAdmin);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserAndAdmin();
  }, [id]);

  async function handleSaveUser(ev, data) {
    ev.preventDefault();
    
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Raw form data object:", data);
    console.log("data.isVerified:", data.isVerified, "type:", typeof data.isVerified);
    console.log("user.isVerified:", user?.isVerified);
    console.log("Keys in data:", Object.keys(data));
    
    // Make sure we're sending admin and isVerified explicitly
    const payload = { 
      ...data, 
      _id: id,
      admin: data.admin !== undefined ? data.admin : user?.admin,
      isVerified: data.isVerified !== undefined ? data.isVerified : user?.isVerified
    };
    
    // Remove duplicate/wrong field names
    delete payload.verified;
    delete payload.isAdmin;
    
    console.log("Final sending payload:", payload);
    console.log("=== END DEBUG ===");

    try {
      const response = await fetch("/api/profile/", {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Refetch the updated user
      console.log("Update successful, refetching user...");
      const updatedResponse = await fetch(`/api/profile?_id=${id}`);
      if (!updatedResponse.ok) {
        throw new Error("Failed to refetch user");
      }
      const updatedUser = await updatedResponse.json();
      console.log("Updated user:", updatedUser);
      setUser(updatedUser);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(error.message || "Failed to update profile");
    }
  }

  if (profileLoading || status === "loading" || isLoadingUser) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (isAdmin === null || user === null) {
    return <div>Unable to load user data</div>;
  }

  return (
    <section className="mt-24 max-w-2xl mx-auto">
      <div className="mt-8">
        <UserForm user={user} onSave={handleSaveUser} isAdmin={isAdmin} />
      </div>
    </section>
  );
}

export default EditUserPage;