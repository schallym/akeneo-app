"use client";

import Link from "next/link";
import { getMainApp } from "@/lib/repositories/app-repository";
import { useEffect, useState } from "react";
import { AkeneoApp } from "@/lib/models";
import { testMainConnection } from "@/lib/actions/app-actions";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const Button = dynamic(() => import("akeneo-design-system").then((mod) => mod.Button));
const Helper = dynamic(() => import("akeneo-design-system").then((mod) => mod.Helper));
const TextInput = dynamic(() => import("akeneo-design-system").then((mod) => mod.TextInput));

export default function App() {
  const [app, setApp] = useState<AkeneoApp>({
    pimUrl: "",
    id: "",
    apiToken: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    getMainApp().then((data) => {
      setApp(data);
    });
  }, []);

  const checkConnection = async () => {
    try {
      await testMainConnection();
      toast.success("Connection is well configured and enabled!");
    } catch (e: any) {
      toast.error(`Test failed: ${e.message}`);
    }
  };

  return (
    <div>
      <h1 className="title">Manage your app</h1>
      <Helper level="info">
        For permissions, scopes and catalog management, please refer to the{" "}
        <Link href="https://api.akeneo.com/apps/authentication-and-authorization.html" target="_blank">
          authorization and authentication
        </Link>{" "}
        documentation.
      </Helper>
      <div className="w-5/12 mt-5">
        <span className="input-label">URL</span>
        <div className="my-1">
          <TextInput placeholder="Please enter a value in the TextInput" value={app?.pimUrl} readOnly></TextInput>
        </div>
      </div>
      <Button className="mt-3" level="secondary" onClick={() => checkConnection()}>
        Test connection
      </Button>
    </div>
  );
}
