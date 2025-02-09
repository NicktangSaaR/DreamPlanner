
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Edit2, Save, X } from "lucide-react";
import { UserTypeSelect } from "./UserTypeSelect";

interface EditableUser {
  id: string;
  full_name: string | null;
  email: string;
}

interface UserTableProps {
  users: any[];
  editingUser: EditableUser | null;
  editForm: { full_name: string; email: string; password?: string };
  onEdit: (user: any) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (userId: string) => void;
  onUpdateType: (userId: string, newType: string) => void;
  onFormChange: (field: string, value: string) => void;
}

export const UserTable = ({
  users,
  editingUser,
  editForm,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onUpdateType,
  onFormChange,
}: UserTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Password</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>School</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              {editingUser?.id === user.id ? (
                <Input
                  value={editForm.full_name}
                  onChange={(e) => onFormChange('full_name', e.target.value)}
                  className="w-full"
                />
              ) : (
                user.full_name || 'N/A'
              )}
            </TableCell>
            <TableCell>
              {editingUser?.id === user.id ? (
                <Input
                  value={editForm.email}
                  onChange={(e) => onFormChange('email', e.target.value)}
                  className="w-full"
                  type="email"
                />
              ) : (
                user.email || 'N/A'
              )}
            </TableCell>
            <TableCell>
              {editingUser?.id === user.id ? (
                <Input
                  value={editForm.password || ''}
                  onChange={(e) => onFormChange('password', e.target.value)}
                  className="w-full"
                  type="password"
                  placeholder="新密码"
                />
              ) : (
                '********'
              )}
            </TableCell>
            <TableCell>
              <UserTypeSelect
                currentType={user.user_type}
                userId={user.id}
                onUpdate={onUpdateType}
              />
            </TableCell>
            <TableCell>{user.school || 'N/A'}</TableCell>
            <TableCell>
              {format(new Date(user.created_at), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {editingUser?.id === user.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onSave}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
