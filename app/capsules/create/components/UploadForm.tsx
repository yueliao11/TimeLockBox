'use client';

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileUpload } from "./FileUpload";
import { UnlockSettings } from "./UnlockSettings";
import { RecipientInput } from "./RecipientInput";
import { AIsuggestions } from "./AIsuggestions";
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { toast } from 'sonner';
import { CONTRACT } from '@/config/constants';
import { useState } from 'react';



const formSchema = z.object({
  message: z.string().optional(),
  files: z.array(z.any()).optional(),
  contentType: z.enum(["text", "image", "video"]).default("text"),
  unlockTime: z.string().min(1, "Please select unlock time"),
  unlockType: z.enum(["single", "periodic"]).default("single"),
  recipientAddress: z.string()
    .min(66, "SUI address must be 66 characters")
    .max(66, "SUI address must be 66 characters")
    .regex(/^0x[a-fA-F0-9]{64}$/, "Invalid SUI address format")
});

export function UploadForm() {
  const [loading, setLoading] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      files: [],
      contentType: "text",
      unlockTime: "",
      unlockType: "single",
      recipientAddress: ""
    }
  });

  const { handleSubmit, formState: { errors }, watch } = form;
  const unlockType = watch("unlockType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('=== Form Submission Data ===');
    console.log('Raw form values:', values);
    
    Object.entries(values).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });

    console.log('Form validation state:', {
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
      errors: form.formState.errors
    });

    if (!currentAccount) {
      console.log('Error: Wallet not connected');
      toast.error('Please connect wallet first');
      return;
    }

    const unlockDate = new Date(values.unlockTime);
    console.log('Unlock date:', {
      input: values.unlockTime,
      parsed: unlockDate,
      timestamp: unlockDate.getTime()
    });

    if (unlockDate <= new Date()) {
      console.log('Error: Invalid unlock time');
      toast.error('Unlock time must be in the future');
      return;
    }

    try {
      setLoading(true);
      console.log('=== Transaction Parameters ===');
      
      const tx = new Transaction();
      const timestamp = Math.floor(unlockDate.getTime() / 1000); // Convert to seconds
      
      console.log('Transaction parameters:', {
        message: values.message,
        contentType: values.contentType,
        unlockTime: timestamp,
        unlockType: values.unlockType,
        recipient: values.recipientAddress,
        files: values.files
      });

      tx.moveCall({
        target: `${CONTRACT.PACKAGE_ID}::capsule::create_capsule`,
        arguments: [
          tx.pure.string(values.message || ''),
          tx..string(values.contentType),
          tx.pure.u64(timestamp),
          tx.pure.address(values.recipientAddress),
          tx.sharedObjectRef({
            objectId: CONTRACT.CLOCK_ID,
            mutable: false,
            initialSharedVersion: '1'
          })
        ]
      });

      console.log('Executing transaction...');
      await signAndExecute({
        transaction: tx,
        options: {
          showEffects: true,
          showEvents: true,
          gasBudget: 50000000
        }
      }, {
        onSuccess: (result) => {
          console.log('Transaction successful:', result);
          toast.success('Time capsule created successfully!');
          form.reset();
        },
        onError: (error) => {
          console.error('Transaction failed:', error);
          toast.error('Failed to create time capsule');
        }
      });

    } catch (error) {
      console.error('=== Error Details ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      toast.error('Failed to create capsule: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  console.log('Current form state:', {
    values: form.watch(),
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FileUpload form={form} name="files" />
        <UnlockSettings form={form} name="unlockTime" typeName="unlockType" />
        <RecipientInput form={form} name="recipientAddress" />
        <AIsuggestions form={form} name="message" />
        
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm">
            {Object.entries(errors).map(([key, error]) => (
              <p key={key}>{error.message as string}</p>
            ))}
          </div>
        )}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Capsule'}
        </Button>
      </form>
    </Form>
  );
}