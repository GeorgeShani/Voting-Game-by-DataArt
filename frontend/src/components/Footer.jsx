export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center py-6 bg-transparent">
      <p className="font-medium text-md md:text-lg">&copy; {currentYear} DailyJokes. All rights reserved.</p>
    </footer>
  );
}
