"use client";

import { Button } from "@/components/ui/Button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ArrowRight, PieChart, TrendingUp, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function LandingPage() {
    const handleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in", error);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32 lg:py-40">
                <motion.div
                    className="container mx-auto px-4 md:px-6"
                    initial="hidden"
                    animate="show"
                    variants={container}
                >
                    <div className="flex flex-col items-center space-y-6">
                        <motion.div variants={item} className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-primary">
                            New: Smart Budget Tracking
                        </motion.div>
                        <motion.h1 variants={item} className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            Master Your Money with Confidence
                        </motion.h1>
                        <motion.p variants={item} className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                            Experience the future of personal finance. Track income, manage expenses, and visualize your financial health with our premium, intuitive platform.
                        </motion.p>
                        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                            <Button size="lg" onClick={handleLogin} className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all">
                                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                View Demo
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 md:px-6 py-24 bg-muted/30 rounded-3xl my-8">
                <motion.div
                    className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <PieChart className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Visual Analytics</h3>
                        <p className="text-muted-foreground">
                            See where your money goes with beautiful, interactive charts and graphs.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Smart Tracking</h3>
                        <p className="text-muted-foreground">
                            Effortlessly log income and expenses. Categorize transactions for better insights.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Secure & Private</h3>
                        <p className="text-muted-foreground">
                            Your financial data is encrypted and secure. We prioritize your privacy.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 md:px-6 py-24 text-center">
                <motion.div
                    className="flex flex-col items-center space-y-6 max-w-2xl mx-auto"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        Ready to take control?
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                        Join thousands of users who are already managing their finances smarter.
                    </p>
                    <Button size="lg" onClick={handleLogin} className="h-12 px-8 text-lg">
                        Create Free Account
                    </Button>
                </motion.div>
            </section>
        </div>
    );
}
