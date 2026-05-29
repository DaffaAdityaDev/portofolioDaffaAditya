import React, { useState, useMemo } from 'react';

export type PackageType = 'crud' | 'low-code' | 'ai' | 'saas' | 'custom';

export const useFreelance = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  
  const [calculatorInputs, setCalculatorInputs] = useState({
    selectedPackage: 'crud' as PackageType,
    screenCount: 5,
    apiNodes: 3,
    selectedAddons: [] as string[],
    timelineSpeed: 'standard' as 'standard' | 'urgent',
    supportCoverage: 'standard' as 'standard' | '24_7'
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectDesc: ''
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const estimatedQuote = useMemo(() => {
    let basePrice = 0;
    let includedScreens = 0;
    let includedApis = 0;

    switch (calculatorInputs.selectedPackage) {
      case 'crud':
        basePrice = 3000;
        includedScreens = 5;
        includedApis = 3;
        break;
      case 'low-code':
        basePrice = 5000;
        includedScreens = 8;
        includedApis = 5;
        break;
      case 'ai':
        basePrice = 7000;
        includedScreens = 6;
        includedApis = 8;
        break;
      case 'saas':
        basePrice = 8500;
        includedScreens = 12;
        includedApis = 10;
        break;
      case 'custom':
        basePrice = 1500;
        includedScreens = 2;
        includedApis = 2;
        break;
    }

    const extraScreens = Math.max(0, calculatorInputs.screenCount - includedScreens);
    const extraApis = Math.max(0, calculatorInputs.apiNodes - includedApis);

    const devSubtotal = basePrice + (extraScreens * 250) + (extraApis * 400);

    const speedMultiplier = calculatorInputs.timelineSpeed === 'urgent' ? 1.35 : 1.0;
    let subtotal = devSubtotal * speedMultiplier;

    if (calculatorInputs.selectedAddons.includes('uiux')) subtotal += 1500;
    if (calculatorInputs.selectedAddons.includes('sla')) subtotal += 2000;
    if (calculatorInputs.selectedAddons.includes('hosting')) subtotal += 800;
    if (calculatorInputs.selectedAddons.includes('domain')) subtotal += 300;

    if (calculatorInputs.supportCoverage === '24_7') subtotal += 1000;

    return Math.round(subtotal);
  }, [calculatorInputs]);

  const handlePackageChange = (pkg: PackageType) => {
    let screens = 5;
    let apis = 3;
    if (pkg === 'low-code') { screens = 8; apis = 5; }
    else if (pkg === 'ai') { screens = 6; apis = 8; }
    else if (pkg === 'saas') { screens = 12; apis = 10; }
    else if (pkg === 'custom') { screens = 2; apis = 2; }
    
    setCalculatorInputs(prev => ({
      ...prev,
      selectedPackage: pkg,
      screenCount: screens,
      apiNodes: apis
    }));
  };

  const handleAddonToggle = (addonId: string) => {
    setCalculatorInputs(prev => {
      const active = prev.selectedAddons.includes(addonId);
      return {
        ...prev,
        selectedAddons: active 
          ? prev.selectedAddons.filter(id => id !== addonId)
          : [...prev.selectedAddons, addonId]
      };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pkgLabel = {
      crud: 'Classic CRUD & Warehouse Systems',
      'low-code': 'Advanced Low-Code Engine',
      ai: 'Autonomous AI Agent Integration',
      saas: 'Full SaaS Application Suite',
      custom: 'Custom Scope / MVP'
    }[calculatorInputs.selectedPackage];

    const addonsList = [];
    if (calculatorInputs.selectedAddons.includes('uiux')) addonsList.push('- Premium UI/UX Figma Design Specs (+$1,500)');
    if (calculatorInputs.selectedAddons.includes('sla')) addonsList.push('- 3-Month SLA Priority Support (+$2,000)');
    if (calculatorInputs.selectedAddons.includes('hosting')) addonsList.push('- Automated Cloud Deployment & SLA Setup (+$800)');
    if (calculatorInputs.selectedAddons.includes('domain')) addonsList.push('- Custom DNS Security & Global Edge Routing (+$300)');
    
    const addonsStr = addonsList.length > 0 ? addonsList.join('\n') : 'None selected';

    const emailSubject = `Project Inquiry: ${pkgLabel} - ${formData.name}`;
    const emailBody = `Hi Daffa,

I would like to initiate a new project. Below is the specification from your Freelance Configurator:

## PROJECT OVERVIEW
- Selected Configuration: ${pkgLabel}
- Screen Count: ${calculatorInputs.screenCount}
- API Integration Nodes: ${calculatorInputs.apiNodes}
- Timeline Delivery: ${calculatorInputs.timelineSpeed === 'urgent' ? 'Urgent / Fast-Track (1.35x multiplier)' : 'Standard'}
- Support Coverage: ${calculatorInputs.supportCoverage === '24_7' ? '24/7 Night/Weekend Shift Coverage (+$1,000)' : 'Standard Business Hours'}
- Add-ons Selected:
${addonsStr}

## ESTIMATED COST
- Total Proposal: $${estimatedQuote.toLocaleString()} USD

## CLIENT DETAILS
- Client Name: ${formData.name}
- Email Address: ${formData.email}

## BRIEF / REQUIREMENT SPEC
${formData.projectDesc}

---
Generated from Freelance Configurator Portal`;

    const mailtoUrl = `mailto:daffaaditya.me@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoUrl;

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', projectDesc: '' });
    }, 4000);
  };

  return {
    showAllProjects,
    setShowAllProjects,
    hoveredNode,
    setHoveredNode,
    calculatorInputs,
    setCalculatorInputs,
    formSubmitted,
    setFormSubmitted,
    formData,
    setFormData,
    activeFaq,
    setActiveFaq,
    estimatedQuote,
    handlePackageChange,
    handleAddonToggle,
    handleFormSubmit
  };
};
