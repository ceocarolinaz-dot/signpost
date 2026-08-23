export default function Thanks() {
  return (
    <main className="mx-auto max-w-lg px-5 py-16">
      <h1 className="text-2xl font-semibold">Thanks — check your email</h1>

      <p className="mt-5 leading-relaxed text-gray-800">We have sent you two links: one to add your photos and details, and one to download your sign.</p>

      <p className="mt-4 leading-relaxed text-gray-800">Keep that email. The edit link is the only way back into your listing.</p>

      <div className="mt-10 border-t border-gray-200 pt-6 text-sm leading-relaxed text-gray-700">
        <p className="font-medium text-gray-900">What happens next</p>
        <p className="mt-2">Add your photos and details first, then download the sign and print it. Ask for matte lamination — gloss reflects sunlight and the code stops scanning.</p>
      </div>

      <p className="mt-10 text-sm text-gray-500">Nothing after a few minutes? Check your spam folder.</p>
    </main>
  );
}