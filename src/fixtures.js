export const states=['Draft','Review','Revision','Done'];
export const actions=['Forward','Return'];
export const title='A small editorial review loop';
export const trapped='Draft: Forward sends the document to Review. Return is forbidden in Draft. Review: Forward completes the process in Done. Return sends the document to Revision. Revision: Forward keeps the document in Revision. Return also keeps the document in Revision. Done is terminal.';
export const repaired='Draft: Forward sends the document to Review. Return is forbidden in Draft. Review: Forward completes the process in Done. Return sends the document to Revision. Revision: Forward sends the document back to Review. Return keeps the document in Revision. Done is terminal.';
export const uncertain='Draft: Forward sends the document to Review. Return is forbidden in Draft. Review: Forward completes the process in Done. Return sends the document to Revision. The actions available in Revision depend on an unspecified editor decision. Done is terminal.';
export const trapMatrix=[[1,-1],[3,2],[2,2],[-1,-1]];
export const repairMatrix=[[1,-1],[3,2],[1,2],[-1,-1]];
