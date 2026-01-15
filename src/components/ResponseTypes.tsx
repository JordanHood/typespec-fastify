import { refkey, type Refkey, code } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";

export function getNoContentResponseRef(): Refkey {
  return refkey("NoContentResponse", "response-types");
}

export function getResponseWithBodyRef(): Refkey {
  return refkey("ResponseWithBody", "response-types");
}

export function ResponseTypes() {
  const noContentRef = getNoContentResponseRef();
  const responseWithBodyRef = getResponseWithBodyRef();

  return (
    <>
      <ts.InterfaceDeclaration
        name="NoContentResponse"
        export
        refkey={noContentRef}
      >
        <>statusCode: number</>
      </ts.InterfaceDeclaration>
      {"\n\n"}
      <>
        export interface ResponseWithBody{"<"}TBody{">"} {"{"}
        {"\n"}
        {"  "}statusCode: number;
        {"\n"}
        {"  "}body: TBody;
        {"\n"}
        {"}"}


       
      </>
    </>
  );
}
/**
 * not quite working yields
 * export interface ResponseWithBody<t> {
    statusCode: number;
    body: T
    }
 */
{/* <ts.InterfaceDeclaration
  name="ResponseWithBody"
  export
  refkey={responseWithBodyRef}
  typeParameters={[{ name: "T" }]}
>
<>
    statusCode: number;{"\n"}
    body: T
  </>
</ts.InterfaceDeclaration> */}
