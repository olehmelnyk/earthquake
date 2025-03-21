'use client';

import { gql, useQuery } from '@apollo/client';

const GET_EARTHQUAKES = gql`
  query GetEarthquakes {
    earthquakes {
      id
      magnitude
      location
      depth
      date
    }
  }
`;

export default function Index() {
  const { loading, error, data } = useQuery(GET_EARTHQUAKES);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Earthquake Tracker</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Magnitude</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depth</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.earthquakes?.length ? (
              data.earthquakes.map((earthquake: any) => (
                <tr key={earthquake.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{earthquake.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{earthquake.magnitude}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{earthquake.depth} km</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(earthquake.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No earthquake data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
