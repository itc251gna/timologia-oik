
const AdminFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-8">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground">
          CSV Data Viewer Pro &copy; {new Date().getFullYear()} - Σύστημα Διαχείρισης Δεδομένων Προμηθευτών
        </p>
        <p className="text-center text-xs text-muted-foreground mt-1">
          Τελευταία ενημέρωση: {new Date().toLocaleDateString('el-GR')} - Βελτιωμένος αλγόριθμος διόρθωσης αριθμών παραστατικών και ημερομηνιών
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;
