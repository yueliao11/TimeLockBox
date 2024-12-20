'use client';

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SparklesIcon } from "lucide-react";
import { useState } from "react";

export function AIsuggestions({ form }) {
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement AI suggestions
      await new Promise(resolve => setTimeout(resolve, 1000));
      const suggestions = "AI generated message suggestions will appear here...";
      form.setValue("message", suggestions);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="message"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Message</FormLabel>
          <div className="space-y-2">
            <FormControl>
              <Textarea
                placeholder="Write a message to accompany your time capsule..."
                {...field}
              />
            </FormControl>
            <Button
              type="button"
              variant="outline"
              onClick={generateSuggestions}
              disabled={isLoading}
              className="w-full"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              {isLoading ? "Generating..." : "Get AI Suggestions"}
            </Button>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
} 