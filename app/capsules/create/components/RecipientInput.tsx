'use client';

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";

export function RecipientInput({ form }) {
  const [inputValue, setInputValue] = useState("");

  const addRecipient = () => {
    if (!inputValue) return;
    
    const currentRecipients = form.getValues("recipients") || [];
    if (!currentRecipients.includes(inputValue)) {
      form.setValue("recipients", [...currentRecipients, inputValue]);
    }
    setInputValue("");
  };

  const removeRecipient = (index: number) => {
    const currentRecipients = form.getValues("recipients");
    form.setValue(
      "recipients",
      currentRecipients.filter((_, i) => i !== index)
    );
  };

  return (
    <FormField
      control={form.control}
      name="recipients"
      render={() => (
        <FormItem>
          <FormLabel>Recipients</FormLabel>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <FormControl>
                <Input
                  placeholder="Enter wallet address"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addRecipient()}
                />
              </FormControl>
              <Button type="button" onClick={addRecipient}>
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {form.watch("recipients")?.map((recipient: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <span className="text-sm truncate">{recipient}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRecipient(index)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
} 