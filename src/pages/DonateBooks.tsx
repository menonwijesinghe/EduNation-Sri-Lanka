import { useMemo, useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BookOpen, CheckCircle, Share2, RefreshCw, Sparkles, Heart, Gift } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";

// Import images
import booksImage from "@/assets/books-stack.png";
import heroImage from "@/assets/hero-children.png";

const bookTypeEnum = z.enum(["kids", "school", "novels", "educational", "other"]);

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone/WhatsApp").max(30),
  district: z.string().trim().min(2, "Please enter your district").max(60),
  city: z.string().trim().min(2, "Please enter your city").max(80),
  bookTypes: z.array(bookTypeEnum).min(1, "Select at least one book type"),
  quantity: z.coerce.number().int().min(1, "Enter an approximate quantity").max(10000),
  condition: z.enum(["new", "used_good"], { required_error: "Select a condition" }),
  message: z.string().trim().max(500).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, { message: "Consent is required" }),
});

type FormValues = z.infer<typeof schema>;

export default function DonateBooks() {
  const { t } = useI18n();
  const defaults = useMemo<FormValues>(
    () => ({
      name: "",
      phone: "",
      district: "",
      city: "",
      bookTypes: [],
      quantity: 1,
      condition: "used_good",
      message: "",
      consent: false,
    }),
    [],
  );

  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: defaults });

 const onSubmit = async (values: FormValues) => {
  try {
    await fetch("https://script.google.com/macros/s/AKfycbwVORENmBnzLEycZxz98gv1-Q1NV4waeo3c74_NEfp8ft1PtphM8VZ9a4D5yZ0Hju8R/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        bookTypes: values.bookTypes.join(", "),
        date: new Date().toISOString(),
      }),
    });

    toast.success("Donation pledge received! 🎉");
    setSubmitted(values);

  } catch (error) {
    toast.error("Submission failed. Please try again.");
  }
};

  const shareOnWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const text = `I just pledged books for EduNation Sri Lanka. Join me: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noreferrer");
  };

  const startOver = () => {
    setSubmitted(null);
    reset(defaults);
  };

  const typeOptions: Array<{ key: z.infer<typeof bookTypeEnum>; label: string; icon: string }> = [
    { key: "kids", label: "Kids Books", icon: "📚" },
    { key: "school", label: "School Textbooks", icon: "📖" },
    { key: "novels", label: "Novels & Stories", icon: "📕" },
    { key: "educational", label: "Educational", icon: "🎓" },
    { key: "other", label: "Other", icon: "📗" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-gold/10 via-background to-primary/10">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-accent-gold/10 blur-3xl" />

        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="p-8 md:p-12 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-gold/10 px-4 py-2 text-sm font-semibold text-accent-gold">
              <Gift className="h-4 w-4" />
              Share Knowledge
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              <span className="text-gradient">{t("donateBooks.title")}</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("donateBooks.description")}
            </p>

            <div className="flex flex-wrap gap-3">
              {["Easy pickup", "Tax receipt available", "Impact photos sent"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-accent-gold" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-full min-h-[300px] md:min-h-[400px]">
            <img
              src={booksImage}
              alt="Beautiful stack of books"
              className="absolute inset-0 h-full w-full object-cover md:rounded-r-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent md:hidden" />
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Form Section */}
        <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 shadow-lg md:p-10">
          <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-cyan text-white shadow-lg">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{t("donateBooks.form.title")}</h2>
                <p className="text-sm text-muted-foreground">Fill out the form to pledge your books</p>
              </div>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-accent-emerald/30 bg-accent-emerald/5 p-8 text-center space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-emerald to-accent-teal text-white">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-accent-emerald">{t("donateBooks.success.title")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("donateBooks.success.body")}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button type="button" variant="hero" size="lg" onClick={shareOnWhatsApp}>
                    <Share2 className="h-5 w-5" />
                    {t("donateBooks.success.share")}
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={startOver}>
                    <RefreshCw className="h-5 w-5" />
                    {t("donateBooks.success.again")}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Submitted for: {submitted.name}</p>
              </div>
            ) : (
              <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Full Name</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    className="h-12 rounded-xl border-border/50 bg-background/50"
                    placeholder="Your name"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-medium">Phone / WhatsApp</Label>
                  <Input
                    id="phone"
                    autoComplete="tel"
                    className="h-12 rounded-xl border-border/50 bg-background/50"
                    placeholder="+94 XX XXX XXXX"
                    {...register("phone")}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="font-medium">District</Label>
                  <Input
                    id="district"
                    autoComplete="address-level1"
                    className="h-12 rounded-xl border-border/50 bg-background/50"
                    placeholder="Your district"
                    {...register("district")}
                  />
                  {errors.district && <p className="text-sm text-destructive">{errors.district.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="font-medium">City</Label>
                  <Input
                    id="city"
                    autoComplete="address-level2"
                    className="h-12 rounded-xl border-border/50 bg-background/50"
                    placeholder="Your city"
                    {...register("city")}
                  />
                  {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label className="font-medium">Book Types</Label>
                  <Controller
                    control={control}
                    name="bookTypes"
                    render={({ field }) => (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {typeOptions.map((opt) => {
                          const checked = field.value.includes(opt.key);
                          return (
                            <label
                              key={opt.key}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-200 ${checked
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border/50 bg-background/50 hover:border-primary/30"
                                }`}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(v) => {
                                  const next = new Set(field.value);
                                  if (v) next.add(opt.key);
                                  else next.delete(opt.key);
                                  field.onChange(Array.from(next));
                                }}
                              />
                              <span className="text-xl">{opt.icon}</span>
                              <span className="text-sm font-medium">{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.bookTypes && <p className="text-sm text-destructive">{errors.bookTypes.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="font-medium">Approximate Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    className="h-12 rounded-xl border-border/50 bg-background/50"
                    placeholder="Number of books"
                    {...register("quantity")}
                  />
                  {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="font-medium">Book Condition</Label>
                  <Controller
                    control={control}
                    name="condition"
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4">
                        <label className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${field.value === "new" ? "border-primary bg-primary/5" : "border-border/50 bg-background/50"
                          }`}>
                          <RadioGroupItem value="new" />
                          <span className="text-sm font-medium">New</span>
                        </label>
                        <label className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${field.value === "used_good" ? "border-primary bg-primary/5" : "border-border/50 bg-background/50"
                          }`}>
                          <RadioGroupItem value="used_good" />
                          <span className="text-sm font-medium">Used (good)</span>
                        </label>
                      </RadioGroup>
                    )}
                  />
                  {errors.condition && <p className="text-sm text-destructive">{errors.condition.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="message" className="font-medium">Optional Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    className="rounded-xl border-border/50 bg-background/50 resize-none"
                    placeholder="Any additional notes..."
                    {...register("message")}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Controller
                    control={control}
                    name="consent"
                    render={({ field }) => (
                      <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-border/50 bg-background/50 p-4">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(Boolean(v))}
                          className="mt-0.5"
                        />
                        <span className="text-sm text-muted-foreground">{t("donateBooks.form.consent")}</span>
                      </label>
                    )}
                  />
                  {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" variant="hero" size="xl" disabled={isSubmitting} className="w-full">
                    <Heart className="h-5 w-5" />
                    Submit Book Pledge
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Guidelines Sidebar */}
        <aside className="space-y-6">
          {/* Image card */}
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={heroImage}
              alt="Children reading"
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <p className="text-white font-medium">Your books will reach children like these</p>
            </div>
          </div>

          {/* Guidelines card */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-soft space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-emerald to-accent-teal text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">{t("donateBooks.guidelines.title")}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-accent-emerald mb-2">✓ {t("donateBooks.guidelines.accepted")}</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent-emerald mt-0.5 shrink-0" />
                    Kids books, school textbooks, novels
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent-emerald mt-0.5 shrink-0" />
                    Sinhala / Tamil / English
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent-emerald mt-0.5 shrink-0" />
                    Clean, readable condition
                  </li>
                </ul>
              </div>

              <div className="h-px bg-border" />

              <div>
                <div className="text-sm font-semibold text-destructive mb-2">✗ {t("donateBooks.guidelines.notAccepted")}</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Torn or missing pages</li>
                  <li>• Heavy water damage or mold</li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
              <div className="text-sm font-semibold text-primary">{t("donateBooks.guidelines.promise")}</div>
              <p className="mt-1 text-sm text-muted-foreground">
                We deliver only books that students can comfortably read and learn from.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
