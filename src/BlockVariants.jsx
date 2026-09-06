import React from 'react';
export default function BlockVariants({children, initialVariant=0, id}) {
 return <div id={id} className="block-variants">{React.Children.toArray(children)[initialVariant]}</div>;
}
