export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full text-center py-4 bg-transparent">
      <p className="font-medium text-md">&copy; {currentYear} DailyJokes. All rights reserved.</p>
    </footer>
  );
}
