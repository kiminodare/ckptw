
import { UserRoleEnum } from "@/app/generated/prisma";
import {getUsers} from "@/services/getListUser";
import {updateUserRole} from "@/services/updateRoleUser";

type SearchParams = {
    search?: string;
    page?: string;
    role?: string;
};

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
    const page = parseInt(searchParams.page || "1");
    const limit = 10;
    const search = searchParams.search || "";
    const role = searchParams.role as UserRoleEnum | undefined;

    const result = await getUsers({ page, limit, search, role });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">User Management</h1>

            <form className="flex gap-4 mb-6">
                <input
                    type="text"
                    name="search"
                    placeholder="Search user..."
                    defaultValue={search}
                    className="border px-3 py-2 rounded w-1/3"
                />
                <select name="role" defaultValue={role || ""} className="border px-3 py-2 rounded">
                    <option value="">All Roles</option>
                    <option value={UserRoleEnum.OWNER}>Owner</option>
                    <option value={UserRoleEnum.ADMIN}>Admin</option>
                    <option value={UserRoleEnum.USER}>User</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Filter
                </button>
            </form>

            <table className="w-full border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Username Discord</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {result.data.map((user) => (
                    <tr key={user.id} className="border-t">
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.username}</td>
                        <td className="p-3">{user.roles[0]?.role?.name || "No Role"}</td>
                        <td className="p-3">
                            <form
                                action={async (formData) => {
                                    "use server";
                                    const newRole = formData.get("role") as UserRoleEnum;
                                    await updateUserRole({
                                        userId: user.id,
                                        role: newRole
                                    });
                                }}
                                className="flex gap-2 items-center"
                            >
                                <select
                                    name="role"
                                    defaultValue={user.roles[0]?.role?.name || UserRoleEnum.USER}
                                    className="border px-2 py-1 rounded"
                                >
                                    <option value={UserRoleEnum.OWNER}>Owner</option>
                                    <option value={UserRoleEnum.ADMIN}>Admin</option>
                                    <option value={UserRoleEnum.USER}>User</option>
                                </select>
                                <button
                                    type="submit"
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Update
                                </button>
                            </form>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="flex justify-between mt-4">
                <a
                    href={`?page=${page - 1}&search=${search}&role=${role || ""}`}
                    className={`px-4 py-2 border rounded ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                    Previous
                </a>
                <div>
                    Page {result.pagination.page} of {result.pagination.totalPages}
                </div>
                <a
                    href={`?page=${page + 1}&search=${search}&role=${role || ""}`}
                    className={`px-4 py-2 border rounded ${
                        page === result.pagination.totalPages ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                    Next
                </a>
            </div>
        </div>
    );
}
