function renderCategoryTree(categories) {
    let html = '<ul>';
  
    for (const cat of categories) {
      html += `<li>
        <div style="display: flex; gap: 1em;">
          <div><strong>${cat.name}</strong></div>
          <div>${cat.description || ''}</div>
          <div>${cat.imageUrl ? `<img src="${cat.imageUrl}" alt="${cat.name}" width="50" />` : ''}</div>
        </div>`;
      
      if (cat.children && cat.children.length > 0) {
        html += renderCategoryTree(cat.children);
      }
  
      html += '</li>';
    }
  
    html += '</ul>';
    return html;
  }
  function buildCategoryTree(categories) {
    const map = {};
    const roots = [];
  
    // Create a lookup map
    categories.forEach(cat => map[cat.categoryID] = { ...cat, children: [] });
  
    // Assign children to parents
    categories.forEach(cat => {
      if (cat.parentCategoryID) {
        map[cat.parentCategoryID].children.push(map[cat.categoryID]);
      } else {
        roots.push(map[cat.categoryID]);
      }
    });
  
    return roots;
  }
  const categories = [
    { categoryID: 1, name: "Electronics", description: "All gadgets", imageUrl: "img1.jpg", parentCategoryID: null },
    { categoryID: 2, name: "Phones", description: "Smartphones", imageUrl: "img2.jpg", parentCategoryID: 1 },
    { categoryID: 3, name: "Laptops", description: "Portable computers", imageUrl: "img3.jpg", parentCategoryID: 1 },
    { categoryID: 4, name: "Accessories", description: "Add-ons", imageUrl: "img4.jpg", parentCategoryID: 2 },
  ];
      