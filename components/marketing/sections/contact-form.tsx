"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const contactSchema = z.object({
    name: z.string().trim().min(2, "Name is too short").max(80),
    email: z.string().trim().email("Enter a valid email").max(160),
    phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
    subject: z.string().trim().min(2).max(120),
    message: z.string().trim().min(10, "Tell us a little more").max(1000),
});
export type ContactFormValues = z.infer<typeof contactSchema>;
export const admissionSchema = z.object({
    fullName: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
    dob: z.string().min(4, "Date of birth required"),
    qualification: z.string().min(2).max(120),
    course: z.string().min(2),
    targetExam: z.string().min(2),
    city: z.string().trim().min(2).max(80),
    message: z.string().trim().max(800).optional().or(z.literal("")),
    consent: z.literal(true, { error: "You must accept the terms and conditions" }),
});
export type AdmissionFormValues = z.infer<typeof admissionSchema>;

export default function ContactForm() {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });
    const onSubmit = async (values: any) => {
        setLoading(true);
        setLoading(false);
        toast.success("Message sent — we'll reply within 24 hours."); reset();
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone")} aria-invalid={!!errors.phone} />
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
                </div>
                <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" {...register("subject")} aria-invalid={!!errors.subject} />
                    {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}</div>
                <div className="md:col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={5} {...register("message")} aria-invalid={!!errors.message} />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
                </div>
            </div>
            <Button type="submit" disabled={loading} className="mt-6 bg-[var(--navy-deep)] text-white hover:bg-[var(--navy)]">
                {loading ? "Sending..." : (<>Send message <Send className="ml-2 h-4 w-4" /></>)}
            </Button>
        </form>
    )
}
