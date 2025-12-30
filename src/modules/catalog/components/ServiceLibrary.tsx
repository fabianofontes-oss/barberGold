'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Check, Edit2, X } from 'lucide-react';

interface ServiceTemplate {
    id: string;
    category: string;
    name: string;
    description: string;
    suggested_price: number;
    suggested_duration: number;
    icon: string;
}

interface MyService {
    id: string;
    template_id: string;
    name: string;
    price: number;
    duration_minutes: number;
    is_active: boolean;
}

export function ServiceLibrary() {
    const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
    const [myServices, setMyServices] = useState<MyService[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState<string | null>(null);
    const [editPrice, setEditPrice] = useState('');
    const [editDuration, setEditDuration] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const supabase = createClient();

        // Buscar templates
        const { data: templatesData } = await supabase
            .from('service_templates')
            .select('*')
            .order('category', { ascending: true })
            .order('name', { ascending: true });

        // Buscar meus serviços
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile } = await supabase
            .from('profiles')
            .select('tenant_id')
            .eq('user_id', session.user.id)
            .single();

        if (!profile) return;

        const { data: servicesData } = await supabase
            .from('services')
            .select('*')
            .eq('tenant_id', profile.tenant_id);

        setTemplates(templatesData || []);
        setMyServices(servicesData || []);
        setLoading(false);
    }

    async function toggleService(template: ServiceTemplate) {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile } = await supabase
            .from('profiles')
            .select('tenant_id')
            .eq('user_id', session.user.id)
            .single();

        if (!profile) return;

        // Verificar se já existe
        const existing = myServices.find(s => s.template_id === template.id);

        if (existing) {
            // Remover (ou desativar)
            await supabase
                .from('services')
                .delete()
                .eq('id', existing.id);

            setMyServices(prev => prev.filter(s => s.id !== existing.id));
        } else {
            // Adicionar
            const { data: newService } = await supabase
                .from('services')
                .insert({
                    tenant_id: profile.tenant_id,
                    template_id: template.id,
                    name: template.name,
                    description: template.description,
                    price: template.suggested_price,
                    duration_minutes: template.suggested_duration,
                    is_active: true,
                })
                .select()
                .single();

            if (newService) {
                setMyServices(prev => [...prev, newService]);
            }
        }
    }

    async function saveEdit(serviceId: string) {
        const supabase = createClient();

        await supabase
            .from('services')
            .update({
                price: parseFloat(editPrice),
                duration_minutes: parseInt(editDuration),
            })
            .eq('id', serviceId);

        // Atualizar local
        setMyServices(prev => prev.map(s =>
            s.id === serviceId
                ? { ...s, price: parseFloat(editPrice), duration_minutes: parseInt(editDuration) }
                : s
        ));

        setEditingService(null);
    }

    function startEdit(service: MyService) {
        setEditingService(service.id);
        setEditPrice(service.price.toString());
        setEditDuration(service.duration_minutes.toString());
    }

    const categories = Array.from(new Set(templates.map(t => t.category)));

    if (loading) {
        return <div className="p-8 text-center">Carregando biblioteca...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">📚 Biblioteca de Serviços</h2>
                <p className="text-zinc-400">Marque os serviços que sua barbearia oferece. Você pode editar preços e duração depois.</p>
            </div>

            {categories.map(category => {
                const categoryTemplates = templates.filter(t => t.category === category);

                return (
                    <div key={category} className="mb-8">
                        <h3 className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2">
                            <span>{categoryTemplates[0]?.icon}</span>
                            {category}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryTemplates.map(template => {
                                const myService = myServices.find(s => s.template_id === template.id);
                                const isActive = !!myService;
                                const isEditing = editingService === myService?.id;

                                return (
                                    <div
                                        key={template.id}
                                        className={`
                      border rounded-lg p-4 transition-all
                      ${isActive
                                                ? 'bg-amber-500/10 border-amber-500/30'
                                                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                            }
                    `}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                {/* Checkbox */}
                                                <button
                                                    onClick={() => toggleService(template)}
                                                    className={`
                            mt-1 w-5 h-5 rounded border flex items-center justify-center
                            ${isActive
                                                            ? 'bg-amber-500 border-amber-500'
                                                            : 'border-zinc-600 hover:border-amber-500'
                                                        }
                          `}
                                                >
                                                    {isActive && <Check className="w-3 h-3 text-black" />}
                                                </button>

                                                {/* Info */}
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-white">{template.name}</h4>
                                                    <p className="text-sm text-zinc-400 mb-2">{template.description}</p>

                                                    {/* Preço e Duração (Editável se ativo) */}
                                                    {isActive && myService && (
                                                        <div className="flex items-center gap-4 text-sm">
                                                            {isEditing ? (
                                                                <>
                                                                    <input
                                                                        type="number"
                                                                        value={editPrice}
                                                                        onChange={(e) => setEditPrice(e.target.value)}
                                                                        className="w-20 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-white"
                                                                        placeholder="Preço"
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        value={editDuration}
                                                                        onChange={(e) => setEditDuration(e.target.value)}
                                                                        className="w-16 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-white"
                                                                        placeholder="Min"
                                                                    />
                                                                    <button
                                                                        onClick={() => saveEdit(myService.id)}
                                                                        className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs"
                                                                    >
                                                                        Salvar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingService(null)}
                                                                        className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-white text-xs"
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-amber-500 font-semibold">
                                                                        R$ {myService.price.toFixed(2)}
                                                                    </span>
                                                                    <span className="text-zinc-400">
                                                                        {myService.duration_minutes} min
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Sugestão (se não ativo) */}
                                                    {!isActive && (
                                                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                                                            <span>R$ {template.suggested_price.toFixed(2)}</span>
                                                            <span>{template.suggested_duration} min</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Botão Editar */}
                                            {isActive && myService && !isEditing && (
                                                <button
                                                    onClick={() => startEdit(myService)}
                                                    className="p-2 hover:bg-zinc-800 rounded transition-colors"
                                                    title="Editar preço e duração"
                                                >
                                                    <Edit2 className="w-4 h-4 text-zinc-400" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Resumo */}
            <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Serviços ativos:</span>
                    <span className="text-2xl font-bold text-amber-500">{myServices.length}</span>
                </div>
            </div>
        </div>
    );
}
