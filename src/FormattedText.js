import React from 'react';

const FormattedText = ({ content }) => {
    // Check if the content is defined and not null
    if (!content) {
        return null;
    }

    // Parse the content if it's a string
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;

    // Check if the parsed content has 'ops' property
    if (!parsedContent || !parsedContent.ops) {
        return null;
    }

    return (
        <div>
            {parsedContent.ops.map((op, index) => {
                if (op.insert) {
                    if (op.attributes && op.attributes.bold) {
                        return <strong key={index}>{op.insert}</strong>;
                    } else if (op.attributes && op.attributes.underline) {
                        return <u key={index}>{op.insert}</u>;
                    } else {
                        return op.insert;
                    }
                }
                return null;
            })}
        </div>
    );
};

export default FormattedText;