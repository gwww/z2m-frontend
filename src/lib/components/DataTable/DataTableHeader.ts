export const classAsc = 'table-asc';
export const classDsc = 'table-dsc';

export const sortEvent = (e: Event) => {
    if (!(e.target instanceof Element)) return;
    handleSortTarget(e.target as HTMLElement);
};

export const sortTable = (thead: HTMLElement, column_number: number) => {
    let qs = `tr th:nth-of-type(${column_number})`;
    handleSortTarget(thead.querySelector(qs)!);
};

const handleSortTarget = (sortTarget: HTMLElement) => {
    const node = sortTarget.closest('thead')!;

    // Set desired new sort order
    const sortAscending = sortTarget.getAttribute('aria-sort') !== 'ascending';
    const sortColumn = sortTarget.getAttribute('data-sort');
    if (!sortColumn) return;

    node.querySelectorAll<HTMLElement>(`.${classAsc}, .${classDsc}`).forEach((el) => {
        el.setAttribute('aria-sort', 'none');
    });

    sortTarget.classList.remove(classAsc);
    sortTarget.classList.remove(classDsc);
    sortTarget.classList.add(sortAscending ? classAsc : classDsc);
    sortTarget.setAttribute('aria-sort', sortAscending ? 'ascending' : 'descending');

    performSort(sortTarget.closest('table')!, Number(sortColumn), sortAscending);
};

// Adapted from https://stackoverflow.com/a/55462779
const performSort = (table: Element, column_number: number, ascending: boolean) => {
    // get all the rows from the tbody:
    const tbody = table.querySelector('tbody')!;
    let rows = Array.from(tbody.querySelectorAll('tr'));

    let dir = ascending ? 1 : -1;
    let comparer = (a: any, b: any) => (a < b ? -1 : a > b ? 1 : 0);

    // set up the queryselector for getting the indicated column from a row
    let qs = `td:nth-child(${column_number})`;

    // and then just... sort the rows:
    rows.sort((r1, r2) => {
        let t1 = r1.querySelector(qs)!;
        let t2 = r2.querySelector(qs)!;
        return comparer(t1.textContent, t2.textContent) * dir;
    });

    // and then the magic part that makes the sorting appear on-page:
    rows.forEach((row) => tbody.appendChild(row));
};
