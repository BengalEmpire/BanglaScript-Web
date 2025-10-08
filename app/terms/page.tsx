'use client'; 


import { motion } from 'framer-motion'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 md:py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.h1 
            variants={sectionVariants}
            className="text-4xl font-bold mb-6 text-center"
          >
            Terms and Conditions
          </motion.h1>

          <motion.p 
            variants={sectionVariants}
            className="mb-8 text-center text-gray-600"
          >
            Last updated: October 08, 2025
          </motion.p>

          <motion.section variants={sectionVariants} className="mb-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Development Notice / উন্নয়ন সংক্রান্ত নোটিশ</h2>
            <p className="text-lg leading-relaxed italic text-gray-700">
              BanglaScript পরিকল্পনাধীন ভাবে ডেভেলপমেন্টের মধ্য রয়েছে। তাই ওয়েব playground এবং npm package এর মধ্য কিছু পার্থক্য আপাতত থাকতে পারে। তবে এটি খুব দ্রুত সমাধান হয়ে, সহজে ব্যবহার যোগ্য বাংলা ভাষায় প্রোগ্রামিং করা যাবে। সাথে থাকুন। ধন্যবাদ।
            </p>
            <p className="mt-4 text-sm text-gray-500">
              BanglaScript is currently under active development. Therefore, there may be some temporary differences between the web playground and the NPM package. However, these will be resolved soon, enabling easy programming in Bengali. Stay with us. Thank you.
            </p>
          </motion.section>

          <motion.p 
            variants={sectionVariants}
            className="mb-8 text-lg leading-relaxed"
          >
            Please read these terms and conditions carefully before using Our Service.
          </motion.p>

          <motion.section variants={sectionVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interpretation and Definitions</h2>
            <h3 className="text-xl font-medium mb-2 text-gray-700">Interpretation</h3>
            <p className="mb-4 text-gray-600 leading-relaxed">
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>
            <h3 className="text-xl font-medium mb-2 text-gray-700">Definitions</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
              <li><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to BengalEmpire.</li>
              <li><strong>Country</strong> refers to Bangladesh.</li>
              <li><strong>Content</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You, regardless of the form of that content.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
              <li><strong>Service</strong> refers to the Website, including the web playground and related tools.</li>
              <li><strong>Terms and Conditions</strong> (also referred as &quot;Terms&quot;) mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
              <li><strong>Website</strong> refers to BanglaScript, accessible from https://banglascript.example.com</li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>
          </motion.section>

          <motion.section variants={sectionVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Acknowledgment</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
            </p>
            <p className="mb-4 text-gray-600 leading-relaxed">
              Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
            </p>
            <p className="mb-4 text-gray-600 leading-relaxed">
              By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
            </p>
            <p className="mb-4 text-gray-600 leading-relaxed">
              You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
            </p>
          </motion.section>

          <motion.section variants={sectionVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Use of the Service</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              BanglaScript is an open-source transpiler for writing JavaScript in Bengali syntax. The web playground and NPM package are provided &quot;as is&quot; for educational and development purposes.
            </p>
            <p className="mb-4 text-gray-600 leading-relaxed">
              You agree not to use the Service for any illegal or unauthorized purpose, including but not limited to violating intellectual property rights or distributing harmful code.
            </p>
          </motion.section>

          <motion.section variants={sectionVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Intellectual Property</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
          </motion.section>

          <motion.section variants={sectionVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Limitation of Liability</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              In no event shall the Company be liable for any indirect, incidental, special, consequential or punitive damages arising out of or relating to your use of the Service.
            </p>
          </motion.section>

          <motion.section variants={sectionVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Changes to Terms</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </motion.section>

          <motion.section variants={sectionVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms and Conditions, You can contact us at: support@banglascript.example.com
            </p>
          </motion.section>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}