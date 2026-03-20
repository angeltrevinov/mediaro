export default async function MovieDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    return (
        <div>
            <h1>Movie Details for ID: {id}</h1>
            {/* Fetch and display movie details here */}
        </div>
    );
}
