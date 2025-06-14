
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ReplaceFileDialogProps = {
  open: boolean;
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ReplaceFileDialog = ({ open, fileName, onConfirm, onCancel }: ReplaceFileDialogProps) => (
  <Dialog open={open} onOpenChange={v => !v && onCancel()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Replace Existing File?</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p>
          A file named <span className="font-bold">{fileName}</span> already exists in this project. 
          Uploading will delete the old file and replace it with the new one.
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={onConfirm}>Replace File</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
export default ReplaceFileDialog;
