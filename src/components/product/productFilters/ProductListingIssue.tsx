interface ProductListingIssueProps {
    title: string;
    description: string;
}

function ProductListingIssue({ title, description }: ProductListingIssueProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20 text-center">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-gray-500">{description}</p>
        </div>
    );
}

export default ProductListingIssue;
