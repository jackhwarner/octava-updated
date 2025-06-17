import React, { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { HelpCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

const SUPPORT_FUNCTION_URL = "https://rcowsfonthsyjlfoiqoo.functions.supabase.co/send-support-email";

const Support = () => {
  // Refreshed FAQ list: only up-to-date and relevant site info
  const faqItems = [
    {
      question: "How do I start a new project?",
      answer: "Click the 'New Project' button on your dashboard and provide your project's details."
    },
    {
      question: "How can I find and contact other musicians?",
      answer: "Go to the Browse page to discover musicians and send them a connection request."
    },
    {
      question: "What roles can I assign to a project?",
      answer: "You can assign roles such as Producer, Artist, Songwriter, and more when creating or editing your project."
    },
    {
      question: "How do I send messages to my collaborators?",
      answer: "Go to the Messages page to chat with your collaborators directly from your inbox."
    },
    {
      question: "Is my project data backed up?",
      answer: "Yes. All your data and uploaded files are securely stored and backed up automatically."
    },
    {
      question: "How do I manage my user profile and links?",
      answer: "Visit the Profile section to update your display name, profile image, and add links to your socials or music."
    }
  ];

  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !email || !message) {
      toast({
        title: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const res = await fetch(SUPPORT_FUNCTION_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ subject, email, message }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      if (data.ok) {
        toast({
          title: "Message sent!",
          description: "Your support request has been sent. We'll follow up by email.",
        });
        setSubject("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending support email:', error);
      // Show a more user-friendly error message
      let errorMessage = "Please try again later.";
      if (error.message.includes("Email service is not configured")) {
        errorMessage = "The support system is currently unavailable. Please try again later or contact us directly.";
      } else if (error.message.includes("Missing required fields")) {
        errorMessage = "Please fill out all required fields.";
      } else if (error.message.includes("Not authenticated")) {
        errorMessage = "Please log in to send a support message.";
      }
      
      toast({
        title: "Failed to send message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">Get help and find answers to common questions</p>
        </div>

        <div className="mb-8">
          {/* Contact Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Describe your issue and we'll help you out
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4" onSubmit={handleSend}>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="general">General Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question"
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 w-1/2"
                    type="submit"
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-purple-600" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
