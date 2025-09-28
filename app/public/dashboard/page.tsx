import {getVipProofs} from "@/services/vipProofActions";

interface DashboardProps {
    searchParams: {
        page?: string;
        search?: string;
    };
}

export default async function VipProofDashboard({ searchParams }: DashboardProps) {
    const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
    const search = searchParams.search || "";

    const { data, pagination } = await getVipProofs({ page, limit: 10, search });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">VIP Proof Dashboard</h1>

            <form className="mb-4">
                <input
                    name="search"
                    defaultValue={search}
                    placeholder="Search by username or discordId"
                    className="border px-3 py-2 rounded w-64"
                />
                <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
                    Search
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Username</th>
                        <th className="px-4 py-2 text-left">Discord ID</th>
                        <th className="px-4 py-2 text-left">VIP</th>
                        <th className="px-4 py-2 text-left">Summit Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((proof) => (
                        <tr key={proof.id} className="border-t">
                            <td className="px-4 py-2">{proof.username}</td>
                            <td className="px-4 py-2">{proof.discordId}</td>
                            <td className="px-4 py-2">{proof.isVip ? "Yes" : "No"}</td>
                            <td className="px-4 py-2">{proof.summitTotal}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center gap-2 mt-4">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <a
                        key={i + 1}
                        href={`?page=${i + 1}&search=${search}`}
                        className={`px-3 py-1 border rounded ${
                            pagination.page === i + 1 ? "bg-blue-500 text-white" : ""
                        }`}
                    >
                        {i + 1}
                    </a>
                ))}
            </div>
        </div>
    );
}
