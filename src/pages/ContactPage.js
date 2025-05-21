
import { Mail } from 'lucide-react';

const ContactPage = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
          We're here to help. Reach out with any questions or feedback.
        </p>
      </header>

      <section className="bg-white shadow rounded-lg overflow-hidden">
        <article className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">General Inquiries</h2>
          <p className="mt-2 text-gray-600">
            For general questions about the project or platform, feel free to email us at student_number@students.wits.ac.za.
          </p>
          <div className="mt-4 flex flex-wrap items-center text-gray-700 gap-4">
            <Mail className="h-5 w-5 text-blue-500" />
            <a href="mailto:2663553@students.wits.ac.za" className="underline">
                2663553
            </a>
            <a href="mailto:2709514@students.wits.ac.za" className="underline">
                2709514
            </a>
            <a href="mailto:2673228@students.wits.ac.za" className="underline">
                2673228
            </a>
            <a href="mailto:2684883@students.wits.ac.za" className="underline">
                2684883
            </a>
            <a href="mailto:2440810@students.wits.ac.za" className="underline">
                2440810
            </a>
            <a href="mailto:2684367@students.wits.ac.za" className="underline">
                2684367
            </a>
          </div>
        </article>

        <section className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Feedback or Technical Issues</h2>
          <p className="mt-2 text-gray-600">
            If you encounter bugs or want to suggest improvements, please send an email directly to one of the emails above.
          </p>
        </section>
      </section>
    </main>
  );
};

export default ContactPage;
