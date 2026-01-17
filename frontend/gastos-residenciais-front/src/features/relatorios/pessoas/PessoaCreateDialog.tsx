import * as React from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreatePessoa } from "./hooks";

const schema = z.object({
  nome: z.string().min(2, "Informe o nome (mínimo 2 caracteres).").max(80),
  // coerce transforma string do input em number
  idade: z.coerce
    .number()
    .int("Idade deve ser inteira.")
    .positive("Idade deve ser positiva.")
    .max(130),
});

type FormData = z.infer<typeof schema>;

export function PessoaCreateDialog() {
  const [open, setOpen] = React.useState(false);
  const createMutation = useCreatePessoa();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", idade: 18 },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    await createMutation.mutateAsync(values);
    form.reset({ nome: "", idade: 18 });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova pessoa</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar pessoa</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" placeholder="Ex.: Maria Silva" {...form.register("nome")} />
            {form.formState.errors.nome && (
              <p className="text-sm text-red-600">{form.formState.errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idade">Idade</Label>
            <Input
              id="idade"
              type="number"
              min={1}
              step={1}
              // isso garante que RHF mande number e evita "unknown"
              {...form.register("idade", { valueAsNumber: true })}
            />
            {form.formState.errors.idade && (
              <p className="text-sm text-red-600">{form.formState.errors.idade.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Regra do sistema: menores de 18 não podem cadastrar receitas.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
