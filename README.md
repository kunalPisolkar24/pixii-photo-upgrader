# Pixii Studio — AI Image Generation & Enhancement

Pixii Studio is a professional-grade image generation and enhancement platform built with **Next.js**, **KIE AI**, **Cloudinary**, and **Upstash Redis**. It features a "Precision Minimalism" design system focused on extreme performance, clarity, and user control.

🏆 **Performance Note:** The application is highly optimized, achieving **90+ Lighthouse scores** across all core metrics (Performance, Accessibility, Best Practices, and SEO).

---

## 🚀 Key Features (Functional)

- **Advanced AI Generation**: Generate high-quality images based on complex prompts and reference images.
- **Batch Processing**: Create multiple image variations (up to 4) in a single request.
- **Real-time Status Tracking**: Intelligent polling system that updates image previews as they are generated.
- **Smart Image Export**: 
    - **Bulk Downloads**: Instantly package entire generation batches into a `.zip` file for easy storage.
    - **Single Export**: Individual image viewing and management.
- **Precision Controls**:
    - **Resolution Selection**: Choose between 1k, 2k, and 4k outputs.
    - **Custom Aspect Ratios**: Tailor results for Instagram (4:5), Widescreen (16:9), Cinematic (21:9), and more.
- **Persistent History**: Your generations are saved locally, allowing you to review and manage past work across sessions.

---

## 🛠️ Technical Highlights (Non-Functional)

- **Client-Side Image Compression**: Automatically compresses user uploads before they hit the server. This ensures rapid upload speeds, mitigates payload limits, and reduces bandwidth usage without sacrificing reference quality.
- **Asynchronous Webhooks & Cloud Storage**: Uses webhooks to listen for AI generation completion. Finished assets are automatically piped into **Cloudinary** for secure storage and lightning-fast global delivery via their CDN.
- **Intelligent Request Cancellation**: Support for in-flight generation aborts. If a user clicks "cancel" mid-generation, the network request, ongoing polling, and local UI state are instantly terminated to free up resources.
- **Edge-Ready Rate Limiting**: Integrated with **Upstash Redis** to enforce a strict daily quota (3 generations/day), ensuring platform stability and cost control.
- **"Precision Minimalism" Design**: A custom-built UI using Tailwind CSS and Radix UI primitives, featuring glassmorphism, smooth micro-animations, and fully responsive layouts.

---

## ⚙️ Setup & Installation

### 1. Environment Configuration
Create a `.env` file in the root directory and populate it with the following:

```env
# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL="your_url"
UPSTASH_REDIS_REST_TOKEN="your_token"

# Image Hosting & Delivery (Cloudinary)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# AI Generation Engine (KIE AI)
KIE_AI_API_KEY="your_api_key"
# Webhook URL for async delivery. In production, this must be a public endpoint.
KIE_AI_CALLBACK_URL="https://your-domain.com/api/callback"

# App Config
NEXT_PUBLIC_FORCE_RATE_LIMIT=false
NODE_ENV=development
```

### 2. Run the Application

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build for production (required to see Lighthouse-grade performance)
pnpm build

# Start production server
pnpm start
```

---

## 🧪 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Next.js Route Handlers
- **Infrastructure**: Redis (Rate Limiting), Cloudinary (Image Storage & CDN)
- **Validation**: Zod
